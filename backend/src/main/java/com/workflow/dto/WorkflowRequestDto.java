package com.workflow.dto;

import com.workflow.model.RequestStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WorkflowRequestDto {
    private Long id;
    private WorkflowDto workflow;
    private Long requesterId;
    private String requesterName;
    private RequestStatus status;
    private Integer currentStepIndex;
    private String payloadJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
