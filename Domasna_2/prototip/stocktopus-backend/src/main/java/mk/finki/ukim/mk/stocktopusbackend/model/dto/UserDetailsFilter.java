package mk.finki.ukim.mk.stocktopusbackend.model.dto;

public record UserDetailsFilter(String username, String email, String role) {
    public UserDetailsFilter(String username, String email, String role) {
        this.username = username != null ? username.toLowerCase() : null;
        this.email = email != null ? email.toLowerCase() : null;
        this.role = role != null ? role.toLowerCase() : null;
    }
}
