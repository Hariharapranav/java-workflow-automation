package com.workflow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitRequestDto {
    @NotNull
    private Long workflowId;
    
    @NotNull
    private String payloadJson;
}
