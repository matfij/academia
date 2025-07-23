using System.Numerics;

namespace NumericTypesSuggesterForm;

internal class NumericTypeManager
{
    private string _suggestedType;

    public event EventHandler<string>? SuggestedTypeChange;

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
        ( (BigInteger) float.MinValue,  (BigInteger) float.MaxValue,  "float"  ),
        ( (BigInteger) double.MinValue, (BigInteger) double.MaxValue, "double" ),
    ];


    public NumericTypeManager()
    {
        _suggestedType = "Unknown";
    }

    public void SuggestType(
        BigInteger? minValue,
        BigInteger? maxValue,
        bool? isFloat,
        bool? isPrecise)
    {
        if (minValue is null || maxValue is null || minValue > maxValue)
        {
            _suggestedType = "Unknown";
        }
        else if (isPrecise == true)
        {
            SuggestDecimalType(minValue, maxValue);
        }
        else if (isFloat == true)
        {
            SuggestFloatType(minValue, maxValue);
        }
        else
        {
            SuggestIntegerType(minValue, maxValue);
        }
        SuggestedTypeChange?.Invoke(this, _suggestedType);
    }

    private void SuggestIntegerType(BigInteger? minValue, BigInteger? maxValue)
    {
        foreach (var rangeType in _intRangeToType)
        {
            if (minValue > rangeType.Min && maxValue < rangeType.Max)
            {
                _suggestedType = rangeType.Type;
                break;
            }
        }
    }

    private void SuggestFloatType(BigInteger? minValue, BigInteger? maxValue)
    {
        foreach (var rangeType in _floatRangeToType)
        {
            if (minValue > rangeType.Min && maxValue < rangeType.Max)
            {
                _suggestedType = rangeType.Type;
                break;
            }
        }
    }

    private void SuggestDecimalType(BigInteger? minValue, BigInteger? maxValue)
    {
        if (minValue > (BigInteger)Decimal.MinValue && maxValue < (BigInteger)Decimal.MaxValue)
        {
            _suggestedType = "Decimal";
        }
        else
        {
            _suggestedType = "Impossible representation";
        }
    }
}
