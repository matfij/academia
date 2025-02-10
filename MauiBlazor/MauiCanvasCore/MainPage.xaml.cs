using SkiaSharp;
using SkiaSharp.Views.Maui;
using MauiCanvasCore.Services;
using System.Diagnostics;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private readonly ParticleService _particleService;
        private readonly System.Timers.Timer _timer;
        private (float x, float y) _canvasScalse = (0, 0);

        public MainPage(ParticleService particleService)
        {
            InitializeComponent();
            _particleService = particleService;
            _timer = new(10);
            _timer.Elapsed += (sender, args) => InvalidateCanvas();
            _timer.Start();
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);
            _canvasScalse = (args.Info.Width / 120f, args.Info.Height / 60f);

            using var paint = new SKPaint { Color = SKColors.White };

            var cellWidth = _canvasScalse.x;
            var cellHeight = _canvasScalse.y;

            foreach (var p in _particleService.GetParticles)
            {
                canvas.DrawRect(cellWidth * p.X + 1, cellHeight * p.Y + 1, cellWidth - 1, cellHeight - 1, paint);
            }
        }

        private void OnTouch(object sender, SKTouchEventArgs args)
        {
            if (args.MouseButton == SKMouseButton.Left && (args.ActionType == SKTouchAction.Pressed || args.ActionType == SKTouchAction.Moved))
            {
                var particleX = (int)(args.Location.X / _canvasScalse.x);
                var particleY = (int)(args.Location.Y / _canvasScalse.y);
                _particleService.AddParticle(new Particle { X = particleX, Y = particleY });
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            _particleService.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            _particleService.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }
}
