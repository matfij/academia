namespace Utilities;

public class UserManager(IUserRepository repository)
{
    private IUserRepository _repository = repository;

    public string ReadById(string id)
    {
        return _repository.ReadById(id);
    }

    public void Save(string id, string name)
    {
        _repository.Save(id, name);
    }
}
