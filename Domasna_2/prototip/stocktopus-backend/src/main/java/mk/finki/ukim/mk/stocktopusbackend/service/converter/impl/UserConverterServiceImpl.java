package mk.finki.ukim.mk.stocktopusbackend.service.converter.impl;

import mk.finki.ukim.mk.stocktopusbackend.model.User;
import mk.finki.ukim.mk.stocktopusbackend.model.dto.UserDetailsDTO;
import mk.finki.ukim.mk.stocktopusbackend.service.converter.UserConverterService;
import org.springframework.stereotype.Service;

@Service
public class UserConverterServiceImpl implements UserConverterService {
    @Override
    public UserDetailsDTO convertToUserDetailsDTO(User user) {
        return new UserDetailsDTO(
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString()
        );
    }
}
