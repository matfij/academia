namespace CleanCode;

internal class Naming
{
    // prefer more descriptive names
    // try keeping names short

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
}
