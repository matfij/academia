using Newtonsoft.Json;

namespace Multithreading.QuoteFinder;

internal record Quote(
    [property: JsonProperty("userId")] int UserId,
    [property: JsonProperty("id")] int Id,
    [property: JsonProperty("title")] string Title,
    [property: JsonProperty("body")] string Body
);
