const fragShader = `
#define SHADER_NAME BEND_WAVES_FS

precision mediump float;

uniform float     uTime;
uniform float     uAmplitude;
uniform float     uFrequency;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main( void )
{
    vec2 uv = outTexCoord;
    float offset = uAmplitude * sin((uv.y + (uTime * 0.1)) * uFrequency);
    vec4 texColor = 0.75 * texture2D(uMainSampler, vec2(uv.x + offset, uv.y)) +
	                0.25 * texture2D(uMainSampler, vec2(uv.x - offset, uv.y));
    gl_FragColor = texColor;
}
`;

export default class BendWaves extends Phaser.Renderer.WebGL.Pipelines
	.PostFXPipeline {
	private time;
	public speed: number;
	public amplitude: number;
	public frequency: number;

	constructor(game: Phaser.Game) {
		super({
			game,
			renderTarget: true,
			fragShader,
		});

		this.time = 0;
		this.speed = 0.01;
		this.amplitude = 0.002;
		this.frequency = 150;
	}

	onPreRender() {
		this.time += this.speed;
		this.set1f("uTime", this.time);
		this.set1f("uAmplitude", this.amplitude);
		this.set1f("uFrequency", this.frequency);
	}
}
