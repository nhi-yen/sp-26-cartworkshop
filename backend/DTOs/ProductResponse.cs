namespace backend.DTOs;

public record ProductResponse(
    int Id,
    string Name,
    string Description,
    decimal Price,
    string CategoryName,
    string? ImageUrl,
    DateTime CreatedAt
);
