import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      className="bg-black/90 text-white transition-colors hover:bg-black/85 hover:text-white"
      asChild
    >
      <a href="/login/google" className="flex w-full items-center gap-2">
        <GoogleIcon />
        Sign in with Google
      </a>
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_27_38)">
        <path
          d="M25 13.0833C25 12.2222 24.9167 11.3333 24.7778 10.4999H12.75V15.4166H19.6389C19.3611 16.9999 18.4444 18.3888 17.0833 19.2777L21.1944 22.4722C23.6111 20.2222 25 16.9444 25 13.0833Z"
          fill="#4280EF"
        />
        <path
          d="M12.75 25.5278C16.1944 25.5278 19.0833 24.3889 21.1944 22.4444L17.0833 19.2777C15.9444 20.0555 14.4722 20.5 12.75 20.5C9.41664 20.5 6.61108 18.25 5.58331 15.25L1.36108 18.5C3.52775 22.8055 7.91664 25.5278 12.75 25.5278Z"
          fill="#34A353"
        />
        <path
          d="M5.58329 15.2222C5.05551 13.6389 5.05551 11.9167 5.58329 10.3333L1.36106 7.05554C-0.444492 10.6667 -0.444492 14.9167 1.36106 18.5L5.58329 15.2222Z"
          fill="#F6B704"
        />
        <path
          d="M12.75 5.0833C14.5555 5.05552 16.3333 5.74996 17.6389 6.99996L21.2778 3.3333C18.9722 1.16663 15.9166 -4.07798e-05 12.75 0.027737C7.91664 0.027737 3.52775 2.74996 1.36108 7.05552L5.58331 10.3333C6.61108 7.30552 9.41664 5.0833 12.75 5.0833Z"
          fill="#E54335"
        />
      </g>
      <defs>
        <clipPath id="clip0_27_38">
          <rect width="25" height="25.5556" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
