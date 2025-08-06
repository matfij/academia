namespace Utilities;

public interface IUserRepository
{
    public string ReadById(string id);
    public void Save(string id, string name);
}

public class UserRepository : IUserRepository
{
    private readonly Dictionary<string, string> _users = new()
    {
        { "m-t", "Mark Twin" },
        { "h-h", "Herbie Hancock" },
    };

    public string ReadById(string id)
    {
        return _users[id];
    }

    public void Save(string id, string name)
    {
        _users[id] = name;
    }
}
