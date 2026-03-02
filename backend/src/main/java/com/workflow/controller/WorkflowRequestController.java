package com.workflow.controller;

import com.workflow.dto.ApproveRequestDto;
import com.workflow.dto.RequestApprovalDto;
import com.workflow.dto.SubmitRequestDto;
import com.workflow.dto.WorkflowRequestDto;
import com.workflow.service.WorkflowRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class WorkflowRequestController {

    private final WorkflowRequestService requestService;

    @PostMapping
    public ResponseEntity<WorkflowRequestDto> submitRequest(@RequestBody SubmitRequestDto submitDto, Authentication authentication) {
        String email = authentication.getName();
        return new ResponseEntity<>(requestService.submitRequest(submitDto, email), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<WorkflowRequestDto>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<WorkflowRequestDto>> getMyRequests(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(requestService.getMyRequests(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowRequestDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/{id}/approvals")
    public ResponseEntity<List<RequestApprovalDto>> getRequestApprovals(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestApprovals(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<WorkflowRequestDto> approveOrRejectRequest(
            @PathVariable Long id,
            @RequestBody ApproveRequestDto approveDto,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(requestService.approveOrRejectRequest(id, approveDto, email));
    }
}
