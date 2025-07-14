namespace NumericTypes;

internal static class LinearCongruentialGeneratorStatic
{
    private static uint _state = 1;

    public static int Next()
    {
        _state = 1664525 * _state + 1013904223;
        return (int)(_state & 0x7FFFFFFF);
    }

    public static int Next(int max)
    {
        return Next() % max;
    }

    public static int Next(int min, int max)
    {
        return min + Next(max - min);
    }

}

internal class LinearCongruentialGenerator(uint state)
{
    private uint _state = state;

    public int Next()
    {
        _state = 1664525 * _state + 1013904223;
        return (int)(_state & 0x7FFFFFFF);
    }

    public int Next(int max)
    {
        return Next() % max;
    }

    public int Next(int min, int max)
    {
        return min + Next(max - min);
    }

}
