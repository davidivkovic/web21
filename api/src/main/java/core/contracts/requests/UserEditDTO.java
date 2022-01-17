package core.contracts.requests;

import core.model.User.Gender;

public class UserEditDTO
{
	public String email;
	public String fullName;
	public String dateOfBirth;
	public boolean isPrivate;
	public Gender gender;
}