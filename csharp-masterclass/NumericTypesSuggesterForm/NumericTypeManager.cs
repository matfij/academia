using System.Numerics;

namespace NumericTypesSuggesterForm;

internal class NumericTypeManager
{
    public string SuggestedType { get; private set; }

    private readonly List<(BigInteger Min, BigInteger Max, string Type)> _intRangeToType =
    [
        ( (BigInteger) sbyte.MinValue,  (BigInteger) sbyte.MaxValue,  "sbyte" ),
        ( (BigInteger) byte.MinValue,   (BigInteger) byte.MaxValue,   "byte"  ),
        ( (BigInteger) ushort.MinValue, (BigInteger) ushort.MaxValue, "ushort"),
        ( (BigInteger) short.MinValue,  (BigInteger) short.MaxValue,  "short" ),
        ( (BigInteger) uint.MinValue,   (BigInteger) uint.MaxValue,   "uint"  ),
        ( (BigInteger) int.MinValue,    (BigInteger) int.MaxValue,    "int"   ),
        ( (BigInteger) ulong.MinValue,  (BigInteger) ulong.MaxValue,  "ulong" ),
        ( (BigInteger) long.MinValue,   (BigInteger) long.MaxValue,   "long"  ),
    ];
    private readonly List<(BigInteger Min, BigInteger Max, string Type)> _floatRangeToType = 
    [
        ( (BigInteger) float.MinValue, (BigInteger) float.MaxValue,  "float"  ),
        ( (BigInteger) double.MinValue, (BigInteger) double.MaxValue, "double" ),
    ];


    public NumericTypeManager()
    {
        SuggestedType = "Unknown";
    }

    public void SuggestType(
        BigInteger? minValue,
        BigInteger? maxValue,
        bool? isFloat,
        bool? isPrecise)
    {
        if (minValue is null || maxValue is null || minValue > maxValue)
        {
            SuggestedType = "Unknown";
            return;
        }

        if (isPrecise == true)
        {
            SuggestedType = "Decimal";
            return;
        }

        if (isFloat == true)
        {
            foreach (var rangeType in _floatRangeToType)
            {
                if (minValue > rangeType.Min && maxValue < rangeType.Max)
                {
                    SuggestedType = rangeType.Type;
                    break;
                }
            }
        }
        else
        {
            foreach (var rangeType in _intRangeToType)
            {
                if (minValue > rangeType.Min && maxValue < rangeType.Max)
                {
                    SuggestedType = rangeType.Type;
                    break;
                }
            }
        }
    }
}
