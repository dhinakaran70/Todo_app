package dev.dhina.Todo.models;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
public class Todo {
    @Id
    @GeneratedValue
    Long id;
    @NotNull
    @NotBlank
    @Schema(name = "title", example = "Complete Spring Boot")
    String title;
    Boolean isCompleted;
}