namespace NumericTypes;

internal static class Notes
{
    // 1. integral numbers
    // represented in a binary system

    // Bigint - restricted by host memory
    // long - 64 bits
    // int - 32 bits
    // short - 16 bits
    // byte - 8 bits

    // all with unsigned (positive) counterparts


    // 2. fractions
    // represent by mantissa (number base) and exponent (position of dot)
    // have only approximate precision -> should be compared by equality with tolerance

    // double - 64 bytes
    // float - 32 bits

    // decimal - 128 bits, most precise type, stored in base-10 system
    // guarantee precision but takes more space nad performance is lower


    // NaN - result of undefined mathematical operations


    // checked - enables checked context in which arithmetic overflow will throw exception
    // e.g. when adding two ints result will not fit into 32 bits
    // can be enabled globally in project settings and ignored by unchecked keyword


    public static bool IsAverageEqualTo(this IEnumerable<double> input, double valueToBeChecked)
    {
        if (input.Any(x => double.IsInfinity(x) || double.IsNaN(x)))
        {
            throw new ArgumentException(null, nameof(input));
        }
        var tolerance = 0.00001;
        var average = input.Average();
        return Math.Abs(average - valueToBeChecked) < tolerance;
    }
}
