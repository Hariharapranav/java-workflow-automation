package com.workflow.service;

import com.workflow.dto.ApproveRequestDto;
import com.workflow.dto.RequestApprovalDto;
import com.workflow.dto.SubmitRequestDto;
import com.workflow.dto.WorkflowRequestDto;
import com.workflow.exception.ResourceNotFoundException;
import com.workflow.mapper.WorkflowRequestMapper;
import com.workflow.model.*;
import com.workflow.repository.RequestApprovalRepository;
import com.workflow.repository.UserRepository;
import com.workflow.repository.WorkflowRepository;
import com.workflow.repository.WorkflowRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowRequestService {

    private final WorkflowRequestRepository requestRepository;
    private final WorkflowRepository workflowRepository;
    private final UserRepository userRepository;
    private final RequestApprovalRepository approvalRepository;
    private final WorkflowRequestMapper requestMapper;

    @Transactional
    public WorkflowRequestDto submitRequest(SubmitRequestDto submitDto, String userEmail) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Workflow workflow = workflowRepository.findById(submitDto.getWorkflowId())
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found"));

        if (workflow.getSteps() == null || workflow.getSteps().isEmpty()) {
            throw new IllegalStateException("Workflow has no approval steps defined");
        }

        WorkflowRequest request = WorkflowRequest.builder()
                .workflow(workflow)
                .requester(requester)
                .status(RequestStatus.PENDING)
                .currentStepIndex(0) // Start at step 0
                .payloadJson(submitDto.getPayloadJson())
                .build();

        WorkflowRequest savedRequest = requestRepository.save(request);
        return requestMapper.toDto(savedRequest);
    }

    public List<WorkflowRequestDto> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<WorkflowRequestDto> getMyRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return requestRepository.findByRequesterId(user.getId()).stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }

    public WorkflowRequestDto getRequestById(Long id) {
        return requestMapper.toDto(requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found")));
    }

    public List<RequestApprovalDto> getRequestApprovals(Long requestId) {
        return approvalRepository.findByRequestId(requestId).stream()
                .map(requestMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkflowRequestDto approveOrRejectRequest(Long id, ApproveRequestDto approveDto, String approverEmail) {
        User approver = userRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        WorkflowRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is already " + request.getStatus());
        }

        Workflow workflow = request.getWorkflow();
        WorkflowStep currentStep = workflow.getSteps().get(request.getCurrentStepIndex());

        // Check role permission
        if (approver.getRole() != Role.ADMIN && approver.getRole() != currentStep.getRequiredRole()) {
            throw new IllegalStateException("You do not have the required role to approve this step. Required: " + currentStep.getRequiredRole());
        }

        // Record approval
        RequestApproval approval = RequestApproval.builder()
                .request(request)
                .step(currentStep)
                .approver(approver)
                .status(approveDto.getStatus())
                .comments(approveDto.getComments())
                .build();
        approvalRepository.save(approval);

        if (approveDto.getStatus() == ApprovalStatus.REJECTED) {
            request.setStatus(RequestStatus.REJECTED);
        } else if (approveDto.getStatus() == ApprovalStatus.APPROVED) {
            if (request.getCurrentStepIndex() + 1 < workflow.getSteps().size()) {
                request.setCurrentStepIndex(request.getCurrentStepIndex() + 1);
            } else {
                request.setStatus(RequestStatus.APPROVED);
            }
        }
        
        requestRepository.save(request);
        return requestMapper.toDto(request);
    }
}
