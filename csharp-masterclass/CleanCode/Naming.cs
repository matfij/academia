namespace CleanCode;

internal class Naming
{
    // prefer more descriptive names
    // try keeping names short

    // avoid:
    // meaningless words: manager, handler, data, info
    // over specific names - leaked implementation details
    // Hungarian notation - variable type in name
    // confusing names - too similar, too generic
    // abbreviations - too many abbreviations in different contexts, hard to search
    // abbreviations exceptions - well known exception ex, index i, j, math symbols
    // context repetition - UserReader.ReadUser()

    public static string Reverse_Refactored(string input)
    {
        var letters = new char[input.Length];

        var currentIndex = input.Length - 1;
        foreach (var _char in input)
        {
            letters[currentIndex] = _char;
            --currentIndex;
        }

        return new string(letters);
    }

    public static string BuildFilePathFrom_Refactored(DateTime dateTime, Extension extension)
    {
        var day = dateTime.Day;
        var dayOfWeek = dateTime.DayOfWeek;
        var month = dateTime.Month;
        var year = dateTime.Year;

        var extensionNormalized = extension.ToString().ToLower();

        return $"{dayOfWeek}_{day}_{month}_{year}.{extensionNormalized}";
    }
}

public enum Extension
{
    Txt,
    Json
}
