package mk.finki.ukim.mk.stocktopusbackend.web.rest;


import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserLoginDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public void login(@RequestBody UserLoginDTO userLoginDTO) {
        try {
            this.authService.login(userLoginDTO.email(), userLoginDTO.password());
        } catch (RuntimeException ex) {
            System.out.println(ex.getMessage());
        }
    }

}

