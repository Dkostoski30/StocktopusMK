package mk.finki.ukim.mk.stocktopusbackend.model.dto;

import lombok.NonNull;

public record UserLoginDTO(@NonNull String email,
                           @NonNull String password) {
}
