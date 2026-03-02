package com.workflow.controller;

import com.workflow.dto.WorkflowDto;
import com.workflow.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workflows")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping
    public ResponseEntity<List<WorkflowDto>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowDto> getWorkflowById(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkflowDto> createWorkflow(@RequestBody WorkflowDto workflowDto) {
        return new ResponseEntity<>(workflowService.createWorkflow(workflowDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkflowDto> updateWorkflow(@PathVariable Long id, @RequestBody WorkflowDto workflowDto) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, workflowDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.ok("Workflow deleted successfully!");
    }
}
