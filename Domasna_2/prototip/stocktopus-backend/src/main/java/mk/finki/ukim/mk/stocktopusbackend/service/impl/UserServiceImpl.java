package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsFilter;
import mk.finki.ukim.mk.stocktopusbackend.model.enums.Role;
import mk.finki.ukim.mk.stocktopusbackend.model.exceptions.PasswordsDoNotMatchException;
import mk.finki.ukim.mk.stocktopusbackend.model.exceptions.UserAlreadyExistsException;
import mk.finki.ukim.mk.stocktopusbackend.model.exceptions.UsernameAndPasswordAreRequired;
import mk.finki.ukim.mk.stocktopusbackend.repository.UserRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(String username, String password, String repeatPassword, String email, Role role) {
        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            throw new UsernameAndPasswordAreRequired("Username and password are required");
        }

        if (!password.equals(repeatPassword)) {
            throw new PasswordsDoNotMatchException("Passwords do not match");
        }

        if (this.userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = new User(username, passwordEncoder.encode(password),email, role);

        userRepository.save(user);
    }


    @Override
    public Page<User> fetchUsers(Pageable pageable, UserDetailsFilter userDetailsFilter) {
        return userRepository.findAll(pageable, userDetailsFilter);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public void deleteUser(String username) {
        userRepository.deleteById(username);
    }
}
