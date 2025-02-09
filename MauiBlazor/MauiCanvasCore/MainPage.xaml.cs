using MauiCanvasCore.Services;
using SkiaSharp;
using SkiaSharp.Views.Maui;
using System.Collections.Generic;
using System.Timers;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private readonly ParticleService _particleService;
        private readonly System.Timers.Timer _timer;

        public MainPage(ParticleService particleService)
        {
            _particleService = particleService;
            InitializeComponent();
            _timer = new(100);
            _timer.Elapsed += (sender, args) => InvalidateCanvas();
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);

            using var paint = new SKPaint { Color = SKColors.White, IsAntialias = true };

            foreach (var p in _particleService.GetParticles)
            {
                canvas.DrawRect(10 * p.X, 10 * p.Y, 10, 10, paint);
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            _timer.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            _timer.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }
}
