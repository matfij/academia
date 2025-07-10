namespace TicketsDataAggregator;

internal static class UrlExtensions
{
    public static string ExtractDomain(this string url) => url.Split(".").Last();
}
