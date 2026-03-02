package com.workflow.dto;

import com.workflow.model.Role;
import lombok.Data;

@Data
public class WorkflowStepDto {
    private Long id;
    private String name;
    private Integer stepIndex;
    private Role requiredRole;
}
