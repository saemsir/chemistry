from manim import *

BG="#07131e"; BLUE="#73d7f5"; GOLD="#f3cc6a"; PINK="#ed86a4"; INK="#f1f4ee"; MUTED="#a8bdc9"

class SaemHero(Scene):
    def construct(self):
        self.camera.background_color=BG
        title=Text("PHYSICS IS A VISUAL LANGUAGE",font="DejaVu Sans",weight=BOLD,font_size=32,color=INK).to_edge(UP,buff=.45)
        sub=Text("visualise  →  reason  →  solve",font="DejaVu Sans",font_size=21,color=GOLD).next_to(title,DOWN,buff=.12)
        self.play(FadeIn(title),FadeIn(sub))

        axes=Axes(x_range=[-4,4,1],y_range=[-2.5,2.5,1],x_length=8.2,y_length=4.7,
                  axis_config={"color":MUTED,"stroke_width":2},tips=False)
        f=lambda x:1.55*np.sin(x)*np.exp(-.05*x*x)
        curve=axes.plot(f,x_range=[-3.8,3.8],color=BLUE,stroke_width=5)
        dot=Dot(axes.c2p(-3.8,f(-3.8)),radius=.09,color=GOLD)
        tangent=always_redraw(lambda:axes.get_secant_slope_group(
            x=axes.p2c(dot.get_center())[0],graph=curve,dx=.35,
            dx_line_color=GOLD,dy_line_color=PINK,
            dx_label=None,dy_label=None,secant_line_color=PINK,
            secant_line_length=1.5))
        eq=MathTex(r"v(t)=\frac{dx}{dt}",color=GOLD,font_size=40).to_corner(UR,buff=.35)
        note=Text("The slope is the physics.",font="DejaVu Sans",font_size=23,color=PINK).to_corner(DL,buff=.4)
        self.play(Create(axes))
        self.play(Create(curve),FadeIn(dot))
        self.play(Write(eq),FadeIn(note),Create(tangent))
        self.play(dot.animate.move_to(axes.c2p(2.8,f(2.8))),run_time=3,rate_func=smooth)
        self.wait(1)

class NewtonToMotion(Scene):
    def construct(self):
        self.camera.background_color=BG
        F=MathTex(r"\vec F=m\vec a",font_size=70,color=INK)
        a=MathTex(r"\vec a=\frac{\vec F}{m}",font_size=58,color=BLUE)
        x=MathTex(r"\vec x(t)",font_size=58,color=PINK)
        ar1=Arrow(LEFT,RIGHT,color=GOLD,buff=.35); ar2=Arrow(LEFT,RIGHT,color=GOLD,buff=.35)
        g=VGroup(F,ar1,a,ar2,x).arrange(RIGHT,buff=.3)
        self.play(Write(F)); self.play(GrowArrow(ar1),Write(a))
        self.play(GrowArrow(ar2),TransformFromCopy(a,x)); self.wait(1)
