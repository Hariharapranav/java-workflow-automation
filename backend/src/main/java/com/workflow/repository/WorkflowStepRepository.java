package com.workflow.repository;

import com.workflow.model.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {
    List<WorkflowStep> findByWorkflowIdOrderByStepIndexAsc(Long workflowId);
}
