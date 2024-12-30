package mk.finki.ukim.mk.stocktopusbackend.web.rest;

import lombok.RequiredArgsConstructor;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.service.UserService;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.UserConverterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserConverterService userConverterService;
    @GetMapping
    public Page<UserDetailsDTO> fetchAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role
            ) {
        UserDetailsFilter userDetailsFilter = new UserDetailsFilter(username, email, role);
        return userService.fetchUsers(pageable, userDetailsFilter).map(userConverterService::convertToUserDetailsDTO);
    }

    @DeleteMapping("/delete/{username}")
    public void deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
    }
}
