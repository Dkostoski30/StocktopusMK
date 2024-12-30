package mk.finki.ukim.mk.stocktopusbackend.service;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    void register(String username, String password, String repeatPassword, String email , Role role);
    Page<User> fetchUsers(Pageable pageable, UserDetailsFilter userDetailsFilter);
    void deleteUser(String username);
}

