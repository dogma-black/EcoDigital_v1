import svgPaths from "./svg-8p3mhqw9ji";
import imgLogotipoAgencia from "figma:asset/5ee702cd89d25bece3c68fb630aeb7287de43de0.png";
import imgContrasena from "figma:asset/410ea040dbbda09aa1d961c092cd5e4983900600.png";

function Logotipo() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[18.537px] h-[112.146px] items-center justify-start p-0 relative shrink-0 w-[131.61px]"
      data-name="Logotipo"
    >
      <div className="relative shrink-0 size-[66.523px]" data-name="Vector">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 67 67"
        >
          <path
            d={svgPaths.p39443400}
            fill="var(--fill-0, #DDE1EC)"
            fillOpacity="0.8"
            id="Vector"
          />
        </svg>
      </div>
      <div
        className="font-['SF_Pro:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#dde1ec] text-[18.537px] text-center w-[298.439px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal]">CIRUGIA ESPECIAL</p>
      </div>
    </div>
  );
}

function UsernameInputContainer() {
  return (
    <div
      className="bg-[rgba(255,255,255,0.1)] h-[29.659px] relative rounded-[4.634px] shrink-0 w-[231.707px]"
      data-name="Username Input Container"
    >
      <div className="box-border content-stretch flex flex-row gap-[9.268px] h-[29.659px] items-center justify-start overflow-clip p-[14.829px] relative w-[231.707px]">
        <div
          className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[12.049px] text-[rgba(188,190,192,0.25)] text-left text-nowrap"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          <p className="block leading-[normal] whitespace-pre">
            Nombre de usuario
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0.232px] border-solid inset-[-0.232px] pointer-events-none rounded-[4.86571px]"
      />
    </div>
  );
}

function UsernameFieldContainer() {
  return (
    <div
      className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-[7.415px] items-start justify-start ml-0 mt-0 p-0 relative"
      data-name="Username Field Container"
    >
      <div
        className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12.049px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">Usuario</p>
      </div>
      <UsernameInputContainer />
    </div>
  );
}

function ClarityEyeHideLine() {
  return (
    <div
      className="relative shrink-0 size-[10.55px]"
      data-name="clarity:eye-hide-line"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="clarity:eye-hide-line">
          <g clipPath="url(#clip0_2025_298)">
            <path
              d={svgPaths.p7420c00}
              fill="var(--fill-0, #C7D2D6)"
              id="Vector"
            />
            <path
              d={svgPaths.p54ff800}
              fill="var(--fill-0, #C7D2D6)"
              id="Vector_2"
            />
            <path
              d={svgPaths.pfd68e00}
              fill="var(--fill-0, #C7D2D6)"
              id="Vector_3"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2025_298">
            <rect fill="white" height="10.5504" rx="5.2752" width="10.5504" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PasswordInputContainer() {
  return (
    <div
      className="bg-[rgba(255,255,255,0.1)] h-[29.659px] relative rounded-[4.634px] shrink-0 w-[231.707px]"
      data-name="Password Input Container"
    >
      <div className="box-border content-stretch flex flex-row gap-[9.268px] h-[29.659px] items-center justify-start overflow-clip p-[14.829px] relative w-[231.707px]">
        <div
          className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#bcbec0] text-[12.049px] text-left text-nowrap"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          <p className="block leading-[normal] whitespace-pre">Contraseña</p>
        </div>
        <ClarityEyeHideLine />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#cccccc] border-[0.232px] border-solid inset-[-0.232px] pointer-events-none rounded-[4.86571px]"
      />
    </div>
  );
}

function PasswordFieldContainer() {
  return (
    <div
      className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-[7.415px] items-start justify-start ml-0 mt-[66.732px] p-0 relative"
      data-name="Password Field Container"
    >
      <div
        className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12.049px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">Contraseña</p>
      </div>
      <PasswordInputContainer />
    </div>
  );
}

function InputFieldsContainer() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Input Fields Container"
    >
      <div
        className="[grid-area:1_/_1] flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center ml-0 mt-[135.44px] relative text-[#ffffff] text-[12.049px] text-left text-nowrap translate-y-[-50%]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">
          ¿Olvidaste tu contraseña?
        </p>
      </div>
      <UsernameFieldContainer />
      <PasswordFieldContainer />
    </div>
  );
}

function LoginButtonContainer() {
  return (
    <div
      className="bg-gradient-to-r from-[#322a9a] h-[37.073px] relative rounded-[6.594px] shrink-0 to-[#322a9a] via-[#4036bd] via-[49.519%] w-[231.707px]"
      data-name="Login Button Container"
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[9.268px] h-[37.073px] items-center justify-center px-[149.22px] py-[14.829px] relative w-[231.707px]">
          <div
            className="flex flex-col font-['SF_Pro:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14.829px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[normal] whitespace-pre">Acceder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[13.548px]" data-name="Component 1">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="Component 1">
          <path
            d={svgPaths.p98c300}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.12902"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-center justify-center left-0 overflow-clip p-0 size-[13.548px] top-0"
      data-name="SVG"
    >
      <Component1 />
    </div>
  );
}

function SvgMargin() {
  return (
    <div
      className="absolute h-[13.548px] left-[11.01px] top-[5.69px] w-[20.322px]"
      data-name="SVG:margin"
    >
      <Svg />
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute h-[16.935px] translate-x-[-50%] translate-y-[-50%] w-[136.329px]"
      data-name="Container"
      style={{ top: "calc(50% - 0.292px)", left: "calc(50% + 13.309px)" }}
    >
      <div
        className="absolute flex flex-col font-['SF_Pro:Light',_sans-serif] font-[274.315] justify-center leading-[0] text-[#ffffff] text-[11.855px] text-center text-nowrap top-[8.5px] tracking-[-0.1355px] translate-x-[-50%] translate-y-[-50%]"
        style={{
          fontVariationSettings: "'wdth' 100",
          left: "calc(50% + 0.221px)",
        }}
      >
        <p className="adjustLetterSpacing block leading-[16.935px] whitespace-pre">
          Comunicarme con apoyo
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="bg-[rgba(255,255,255,0.2)] h-[23.904px] relative rounded-[6.774px] shrink-0 w-[185.919px]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0.213px] border-solid inset-0 pointer-events-none rounded-[6.774px]"
      />
      <SvgMargin />
      <Container />
    </div>
  );
}

function Soporte() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[21.248px] h-[101.813px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="soporte"
    >
      <div
        className="basis-0 flex flex-col font-['SF_Pro:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[11.855px] text-center tracking-[-0.1355px] w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[16.935px]">
          ¿Tienes problemas para iniciar sesión?
        </p>
      </div>
      <Button />
      <div
        className="bg-[0%_51.16%] bg-no-repeat bg-size-[100%_264.34%] h-[21.435px] shrink-0 w-[56.661px]"
        data-name="logotipo agencia"
        style={{ backgroundImage: `url('${imgLogotipoAgencia}')` }}
      />
    </div>
  );
}

function LoginForm() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[22.244px] items-start justify-start p-0 relative shrink-0 w-[231.707px]"
      data-name="Login Form"
    >
      <div
        className="flex flex-col font-['SF_Pro:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[22.244px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal] whitespace-pre">Iniciar sesión</p>
      </div>
      <InputFieldsContainer />
      <LoginButtonContainer />
      <Soporte />
    </div>
  );
}

function MainContainer() {
  return (
    <div
      className="absolute bg-[rgba(255,255,255,0.06)] rounded-[26.376px] translate-x-[-50%] translate-y-[-50%]"
      data-name="Main Container"
      style={{ top: "calc(50% - 1.785px)", left: "calc(50% - 219px)" }}
    >
      <div className="box-border content-stretch flex flex-col gap-[37.073px] items-center justify-start overflow-clip px-[74.146px] py-[37.073px] relative">
        <Logotipo />
        <LoginForm />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[0.463px] border-[rgba(255,255,255,0.49)] border-solid inset-0 pointer-events-none rounded-[26.376px]"
      />
    </div>
  );
}

function TarjetaDeBienvenida() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-[13.279px] h-[183px] items-center justify-start leading-[0] left-0 px-[6.905px] py-[23.902px] right-0 rounded-[13.279px] text-[#ededed] text-center translate-y-[-50%]"
      data-name="tarjeta de bienvenida"
      style={{ top: "calc(50% - 163px)" }}
    >
      <div className="font-['SF_Compact:Medium',_sans-serif] font-[556] h-[35px] leading-[normal] relative shrink-0 text-[30px] w-full">
        <p className="block mb-0">¡Bienvenido!</p>
        <p className="block mb-0">&nbsp;</p>
        <p className="block">&nbsp;</p>
      </div>
      <div
        className="font-['SF_Pro:Regular',_sans-serif] font-normal h-[37px] relative shrink-0 text-[12px] tracking-[-0.1266px] w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[15.822px]">{`Sistema de Gestión Médica `}</p>
      </div>
      <div
        className="font-['SF_Pro:Regular',_sans-serif] font-normal h-[67px] relative shrink-0 text-[13px] w-[316px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[normal]">
          Accede a tu espacio de trabajo personalizado con tecnología de
          vanguardia para una experiencia médica integral y segura.
        </p>
      </div>
    </div>
  );
}

function InformacionDoctor() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col h-[299px] items-center justify-start leading-[0] left-0 pb-0 pt-7 px-0 text-[#ededed] text-center top-[212px] w-[370px]"
      data-name="informacion doctor"
    >
      <div className="flex flex-col font-['SF_Compact:Medium',_sans-serif] font-[556] h-[15px] justify-center relative shrink-0 text-[25.265px] w-[289px]">
        <p className="block leading-[normal]">Dr. Joel Sánchez García</p>
      </div>
      <div
        className="flex flex-col font-['SF_Pro:Regular',_sans-serif] font-normal h-[272px] justify-center leading-[normal] relative shrink-0 text-[13px] w-[311px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block mb-0">{`Dedicado a transformar vidas a través de la excelencia en cirugía de columna. `}</p>
        <p className="block mb-0">{`El Dr. Joel Sánchez García es un líder y pionero en su campo, con una formación de élite que incluye una subespecialidad en Cirugía de Columna en Francia. `}</p>
        <p className="block mb-0">&nbsp;</p>
        <p className="block">
          Su legado de más de 25 años y 7,000 cirugías exitosas son el reflejo
          de su compromiso inquebrantable con la salud y el bienestar de sus
          pacientes, devolviéndoles el movimiento y la calidad de vida.
        </p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div
      className="absolute bg-[rgba(255,255,255,0.06)] h-[527px] left-[678px] rounded-[28.458px] top-[121px] w-[370px]"
      data-name="Card"
    >
      <TarjetaDeBienvenida />
      <InformacionDoctor />
    </div>
  );
}

function FormularioTarjeta() {
  return (
    <div
      className="absolute contents top-[83px] translate-x-[-50%]"
      data-name="formulario/tarjeta"
      style={{ left: "calc(50% + 19.5px)" }}
    >
      <MainContainer />
      <Card />
    </div>
  );
}

export default function Contrasena() {
  return (
    <div
      className="bg-[#000000] overflow-clip relative rounded-3xl shadow-[488px_763px_250px_0px_rgba(0,0,0,0),312px_488px_232px_0px_rgba(0,0,0,0.01),176px_275px_195px_0px_rgba(0,0,0,0.05),78px_122px_145px_0px_rgba(0,0,0,0.09),20px_31px_80px_0px_rgba(0,0,0,0.1)] size-full"
      data-name="Contraseña"
      style={{ backgroundImage: `url('${imgContrasena}')` }}
    >
      <FormularioTarjeta />
    </div>
  );
}