package com.workflow.service;

import com.workflow.dto.WorkflowDto;
import com.workflow.exception.ResourceNotFoundException;
import com.workflow.mapper.WorkflowMapper;
import com.workflow.model.Workflow;
import com.workflow.model.WorkflowStep;
import com.workflow.repository.RequestApprovalRepository;
import com.workflow.repository.WorkflowRepository;
import com.workflow.repository.WorkflowRequestRepository;
import com.workflow.model.WorkflowRequest;
import com.workflow.model.RequestApproval;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowRequestRepository workflowRequestRepository;
    private final RequestApprovalRepository requestApprovalRepository;
    private final WorkflowMapper workflowMapper;

    public List<WorkflowDto> getAllWorkflows() {
        return workflowRepository.findAll().stream()
                .map(workflowMapper::toDto)
                .collect(Collectors.toList());
    }

    public WorkflowDto getWorkflowById(Long id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));
        return workflowMapper.toDto(workflow);
    }

    @Transactional
    public WorkflowDto createWorkflow(WorkflowDto workflowDto) {
        Workflow workflow = workflowMapper.toEntity(workflowDto);
        if (workflow.getSteps() != null) {
            for (int i = 0; i < workflow.getSteps().size(); i++) {
                WorkflowStep step = workflow.getSteps().get(i);
                step.setWorkflow(workflow);
                step.setStepIndex(i);
            }
        }
        Workflow savedWorkflow = workflowRepository.save(workflow);
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public WorkflowDto updateWorkflow(Long id, WorkflowDto workflowDto) {
        Workflow existingWorkflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));

        existingWorkflow.setName(workflowDto.getName());
        existingWorkflow.setDescription(workflowDto.getDescription());
        existingWorkflow.getSteps().clear();

        if (workflowDto.getSteps() != null) {
            for (int i = 0; i < workflowDto.getSteps().size(); i++) {
                WorkflowStep step = workflowMapper.stepToEntity(workflowDto.getSteps().get(i));
                step.setWorkflow(existingWorkflow);
                step.setStepIndex(i);
                existingWorkflow.getSteps().add(step);
            }
        }

        Workflow savedWorkflow = workflowRepository.save(existingWorkflow);
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public void deleteWorkflow(Long id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));
        
        // Cascade delete related entities
        List<WorkflowRequest> relatedRequests = workflowRequestRepository.findByWorkflowId(id);
        for (WorkflowRequest request : relatedRequests) {
            List<RequestApproval> approvals = requestApprovalRepository.findByRequestId(request.getId());
            requestApprovalRepository.deleteAll(approvals);
        }
        workflowRequestRepository.deleteAll(relatedRequests);

        workflowRepository.delete(workflow);
    }
}
