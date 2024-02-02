using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSBasics
{
    public class GardenClient : ILoggable
    {
        public int Id { get; private init; }
        public string Name { get; private init; }
        public List<string> ShoppingCart { get; private init; } = new();
        private IClientRepository _repository;
        public ILogger? Logger { get; set; }

        public void LogName() => Logger?.LogState(this);
        // explicit interface member - can only be accessed from objects typed with this interface
        // avoid name collisions
        // hides properties/functions not relevant to main usecase
        string ILoggable.Name => $"Client Id = {Id}";

        string ILoggable.CurrentState
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine($"Id={Id}, Name={Name}, {ShoppingCart.Count} purchases");
                foreach (string purchase in ShoppingCart)
                {
                    sb.AppendLine("    purchased: " + purchase);
                }
                return sb.ToString();
            }
        }

        public GardenClient(int id, string name, IClientRepository repository)
        {
            Id = id;
            Name = name;
            _repository = repository;
        }

        public void AddToCart(string itemName)
        {
            ShoppingCart.Add(itemName);
        }

        public void SaveCart()
        {
            _repository.PersistCart(this);
            Logger.TryLogMethodCall(this, "SaveCart");
        }
    }

    public interface IClientRepository
    {
        bool PersistCart(GardenClient client);
        GardenClient GetGardenById(int id);
    }

    public class ClientRepository : IClientRepository
    {
        public bool PersistCart(GardenClient client)
        {
            Console.WriteLine("Cart persisted!");
            return true;
        }

        public GardenClient GetGardenById(int id)
        {
            GardenClient client = new GardenClient(id, "Cool Gardener", this);
            client.AddToCart("Carrots");
            client.AddToCart("Pumpkin");
            return client;
        }
    }

    public interface ILogger
    {
        void LogState(ILoggable source);
        // default method implementation - without instance state (just fallback)
        void LogMethodCall(ILoggable source, string methodName)
            => throw new NotImplementedException(nameof(LogMethodCall));
        bool CanLogMethodCall { get => false; }
        bool TryLogMethodCall(ILoggable source, string methodName)
        {
            bool canLog = CanLogMethodCall;
            if (canLog)
            {
                LogMethodCall(source, methodName);
            }
            return canLog;
        }
    }

    public interface ILoggable
    {
        string Name { get; }
        string CurrentState { get; }
    }

    public class FileLogger : ILogger
    {
        private string _filePath;
        public FileLogger(string filePath)
        {
            _filePath = filePath;
        }
        public void LogState(ILoggable source)
        {
            string msg = $"{source.Name}:\r\n{source.CurrentState}\r\n\r\n";
            using StreamWriter sw = new StreamWriter(_filePath, true);
            sw.WriteLine(msg);
        }
    }

    public class ConsoleLogger : ILogger
    {
        public void LogState(ILoggable source)
        {
            string msg = $"{source.Name}:\r\n{source.CurrentState}\r\n\r\n";
            Console.WriteLine(msg);
        }

        public bool CanLogMethodCall => true;

        public void LogMethodCall(ILoggable source, string methodName)
        {
            string msg = $"{source.Name}: Calling method {methodName}\r\n";
            Console.WriteLine(msg);
        }
    }

}
