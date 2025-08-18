namespace CleanCode;

public interface IRandomGenerator
{
    public int GetNext(int range);
    public int GetNextInRange(int min, int max);
}

public class QuickRandomGenerator : IRandomGenerator
{
    public int GetNext(int range) => Random.Shared.Next(range);
    public int GetNextInRange(int min, int max) => Random.Shared.Next(min, max);
}

public class PasswordGenerator(IRandomGenerator randomGenerator)
{
    private readonly IRandomGenerator _randomGenerator = randomGenerator;

    private const int _minLength = 1;
    private const string _regularCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const string _specialCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";

    public string Generate(int minLength, int maxLength)
    {
        var (isRangeValid, errorMessage) = ValidateLength(minLength, maxLength);
        if (!isRangeValid)
        {
            throw new ArgumentOutOfRangeException(errorMessage);
        }

        var passwordLength = _randomGenerator.GetNextInRange(minLength, maxLength + 1);

        return GenerateFrom(passwordLength, _regularCharacters);
    }

    public string GenerateSpecial(int minLength, int maxLength)
    {
        var (isRangeValid, errorMessage) = ValidateLength(minLength, maxLength);
        if (!isRangeValid)
        {
            throw new ArgumentOutOfRangeException(errorMessage);
        }

        var passwordLength = _randomGenerator.GetNextInRange(minLength, maxLength + 1);

        return GenerateFrom(passwordLength, _specialCharacters);
    }

    private (bool, string?) ValidateLength(int minLength, int maxLength)
    {
        if (minLength < _minLength)
        {
            return (false, $"{nameof(minLength)} must be greater than 0");
        }
        if (maxLength < minLength)
        {
            return (false, $"{nameof(minLength)} must be smaller than {nameof(maxLength)}");
        }
        else
        {
            return (true, null);
        }
    }
    private string GenerateFrom(int length, string characters)
    {
        var passwordParts = Enumerable
            .Repeat(characters, length)
            .Select(characters => characters[_randomGenerator.GetNext(characters.Length)])
            .ToArray();

        return new string(passwordParts);
    }
}
