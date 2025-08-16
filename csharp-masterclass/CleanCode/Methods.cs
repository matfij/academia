namespace CleanCode;

internal class Methods
{
    // should have an expressive signature
    // ideally take 0 arguments, recommended up to 2, occasionally 3
    // if more arguments - split method, create custom struct
    // usually avoid boolean parameters - split method
    // one method should do only one job at a single level of abstraction

    // worst comments:
    // Capitan obvious - what the statement does
    // what should be done 
    // commented code

    // justifiable comments:
    // TODO comments with proper format and static analysis (warn)
    // doc comments in class libraries
    // explaining hacks in case of deadlines

    // static methods
    // should be used for private methods that don't relay on class state - better performance 
    // should not be used for public methods - this makes DI impossible since static members can't
    // implement an interface - runtime determines which virtual method to run based on instance not class
    // when dealing with static methods that must be mocked for tests use a non-static wrapper 
    // public static methods are acceptable in scenarios in which implementation will never change - Math, extension methods

    private const int _minLength = 3;
    private const int _maxLength = 25;

    public static List<int>? ChooseBetterPath_Refactored(
            List<int> primaryPathSectionsLengths,
            List<int> secondaryPathSectionLengths,
            int maxAcceptableSectionLength)
    {
        if (!AreAllNumbersPositive(primaryPathSectionsLengths) || !AreAllNumbersPositive(secondaryPathSectionLengths))
        {
            throw new ArgumentException("The input collections can't contain negative lengths.");
        }

        bool arePrimaryLengthsInRange = AreAreNumbersBelow(primaryPathSectionsLengths, maxAcceptableSectionLength);
        bool areSecondaryLengthsInRange = AreAreNumbersBelow(secondaryPathSectionLengths, maxAcceptableSectionLength);

        if (!arePrimaryLengthsInRange && !areSecondaryLengthsInRange)
        {
            return null;
        }
        else if (arePrimaryLengthsInRange && areSecondaryLengthsInRange)
        {
            return primaryPathSectionsLengths.Sum() <= secondaryPathSectionLengths.Sum()
                ? primaryPathSectionsLengths
                : secondaryPathSectionLengths;
        }
        else
        {
            return arePrimaryLengthsInRange
                ? primaryPathSectionsLengths
                : secondaryPathSectionLengths;
        }
    }

    private static bool AreAllNumbersPositive(IEnumerable<int> numbers)
    {
        foreach (var number in numbers)
        {
            if (number < 0)
            {
                return false;
            }
        }
        return true;
    }

    private static bool AreAreNumbersBelow(IEnumerable<int> numbers, int max)
    {
        foreach (var number in numbers)
        {
            if (number > max)
            {
                return false;
            }
        }
        return true;
    }

    public static (bool, string) IsValidName_Refactored(string name)
    {
        if (name.Length < _minLength)
        {
            return (false, "The name is too short.");
        }
        if (name.Length > _maxLength)
        {
            return (false, "The name is too long.");
        }
        if (name[0] == char.ToLower(name[0]))
        {
            return (false, "The name starts with a lowercase letter.");
        }
        if (name.Any(letter => !char.IsLetter(letter)))
        {
            return (false, "The name contains non-letter characters.");
        }
        if(name.Skip(1).Any(char.IsUpper))
        {
            return (false, "The name contains uppercase letters after the first character.");
        }
        return (true, "The name is valid.");
    }
}
