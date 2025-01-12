package mk.finki.ukim.mk.stocktopusbackend.web.rest;


import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.config.JwtUtil;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserLoginDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationManager authenticationManager;

    @PostMapping
    public ResponseEntity<String> login(@RequestBody UserLoginDTO userLoginDTO) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userLoginDTO.email(), userLoginDTO.password());

            Authentication authentication = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = JwtUtil.generateToken(authentication.getName(), Map.of("roles", authentication.getAuthorities()));

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body("Login successful! User: " + authentication.getName());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
        }
    }
}



