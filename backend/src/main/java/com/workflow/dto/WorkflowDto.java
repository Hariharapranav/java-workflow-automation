package com.workflow.dto;

import lombok.Data;
import java.util.List;

@Data
public class WorkflowDto {
    private Long id;
    private String name;
    private String description;
    private List<WorkflowStepDto> steps;
}
