package com.workflow.repository;

import com.workflow.model.WorkflowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRequestRepository extends JpaRepository<WorkflowRequest, Long> {
    List<WorkflowRequest> findByRequesterId(Long requesterId);
    List<WorkflowRequest> findByWorkflowId(Long workflowId);
}
