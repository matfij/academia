using SkiaSharp;
using SkiaSharp.Views.Maui;
using MauiCanvasCore.Services;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private static readonly (int x, int y) CanvasSize = (1200, 600);

        private readonly ParticleService ParticleService;
        private readonly System.Timers.Timer PaintTimer;
        private (float x, float y) CanvasScale = (1, 1);
        private (float x, float y, float r) Cursor = (0, 0, 10);
        private readonly SKPaint CursorPaint = new()
        {
            Color = SKColors.Red,
            IsAntialias = true,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 2
        };
        private readonly SKBitmap ParticlesBitmap = new(CanvasSize.x, CanvasSize.y);

        public MainPage(ParticleService particleService)
        {
            InitializeComponent();
            this.ParticleService = particleService;
            PaintTimer = new(20);
            PaintTimer.Elapsed += (sender, args) => MainThread.BeginInvokeOnMainThread(InvalidateCanvas);
            PaintTimer.Start();
        }

        private unsafe void UpdateBitmap()
        {
            var pixels = (uint*)ParticlesBitmap.GetPixels();

            foreach (var particle in ParticleService.GetParticles)
            {
                int index = ((int)particle.X) + (int)(particle.Y * CanvasSize.x);
                if (index >= 0 && index < CanvasSize.x * CanvasSize.y)
                {
                    pixels[index] = 0xFFFFFF;
                }
            }
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            CanvasScale = (args.Info.Width / 1200f, args.Info.Height / 600f);
            UpdateBitmap();

            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);
            canvas.Scale((CanvasScale.x + CanvasScale.y) / 2);

            canvas.DrawBitmap(ParticlesBitmap, 0, 0);
            canvas.DrawCircle(Cursor.x, Cursor.y, Cursor.r, CursorPaint);
        }

        private void OnTouch(object sender, SKTouchEventArgs args)
        {
            if (args.ActionType == SKTouchAction.Moved)
            {
                Cursor.x = args.Location.X / CanvasScale.x;
                Cursor.y = args.Location.Y / CanvasScale.y;
            }
            if (args.ActionType == SKTouchAction.WheelChanged)
            {
                var radius = (int)(2 * (Cursor.r + args.WheelDelta / 5) / (CanvasScale.x + CanvasScale.y));
                Cursor.r = Math.Clamp(radius, 1, 200);
            }
            if ((args.ActionType == SKTouchAction.Pressed || args.ActionType == SKTouchAction.Moved))
            {
                var centerX = (int)(args.Location.X / CanvasScale.x);
                var centerY = (int)(args.Location.Y / CanvasScale.y);
                if (args.MouseButton == SKMouseButton.Left)
                {
                    ParticleService.AddParticles((x: centerX, y: centerY), (int)Cursor.r);
                }
                if (args.MouseButton == SKMouseButton.Right)
                {
                    ParticleService.EraseParticles((x: centerX, y: centerY), (int)Cursor.r);
                }
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            ParticleService.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            ParticleService.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }
}
