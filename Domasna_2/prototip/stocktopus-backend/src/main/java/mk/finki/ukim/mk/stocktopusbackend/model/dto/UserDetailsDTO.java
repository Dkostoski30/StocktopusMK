package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import lombok.NonNull;

public record UserDetailsDTO(@NonNull String username,
                             @NonNull String email,
                             @NonNull String role) {
}
