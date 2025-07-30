namespace Utilities;

public class NumericUtils
{
    public static int GetEvenSumUpTo(int max)
    {
        var sum = 0;

        for (int i = 0; i <= max; i += 2)
        {
            sum += i;
        }

        return sum;
    }
}
