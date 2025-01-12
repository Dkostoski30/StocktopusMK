package mk.finki.ukim.mk.stocktopusbackend.web.rest;


import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.enums.Role;
import mk.finki.ukim.mk.stocktopusbackend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegisterController {
    private final UserService userService;


    @PostMapping
    public void register(@RequestBody UserDTO userDTO) {
        this.userService.register(userDTO.username(), userDTO.password(), userDTO.repeatedPassword(), userDTO.email(), Role.ROLE_USER);
    }
}

