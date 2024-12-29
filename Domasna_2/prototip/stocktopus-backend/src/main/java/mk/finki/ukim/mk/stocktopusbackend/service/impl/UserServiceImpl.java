package mk.finki.ukim.mk.stocktopusbackend.service.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.enums.Role;
import mk.finki.ukim.mk.stocktopusbackend.repository.UserRepository;
import mk.finki.ukim.mk.stocktopusbackend.service.UserService;
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
            throw new RuntimeException("Username and password are required"); // TODO: Create a custom exception
        }

        if (!password.equals(repeatPassword)) {
            throw new RuntimeException("Passwords do not match"); // TODO: Create a custom exception PasswordsDoNotMatchException
        }

        if (this.userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists"); // TODO: Create a custom exception UserAlreadyExistsException
        }

        User user = new User(username, passwordEncoder.encode(password),email, role);

        userRepository.save(user);
    }

    @Override
    public List<User> fetchUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
