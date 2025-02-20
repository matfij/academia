using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MauiCanvasCore.Services
{
    internal class LockAttribute : Attribute
    {
        private static readonly object LockObject = new();

        public static T ExecuteWithLock<T>(Func<T> action)
        {
            lock (LockObject)
            {
                return action();
            }
        }

        public static void ExecuteWithLock(Action action)
        {
            lock (LockObject)
            {
                action();
            }
        }
    }

    internal static class LockAssistant
    {
        public static T RunWithLock<T>(Func<T> action)
        {
            var actionInfo = action.Method;
            if (actionInfo.GetCustomAttribute<LockAttribute>() != null)
            {
                return LockAttribute.ExecuteWithLock(action);
            }
            else
            {
                return action();
            }
        }
        public static void RunWithLock(Action action)
        {
            var actionInfo = action.Method;
            if (actionInfo.GetCustomAttribute<LockAttribute>() != null)
            {
                LockAttribute.ExecuteWithLock(action);
            }
            else
            {
                action();
            }
        }
    }
}