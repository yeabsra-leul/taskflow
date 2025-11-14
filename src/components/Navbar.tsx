// "use client"

// import React from "react";
// import { Trello } from "lucide-react";
// import { useClerk, UserButton } from "@clerk/nextjs";
// import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
// import { Button } from "./ui/button";

// const Navbar = () => {
//   return (
//     <div className="bg-white border-b backdrop-blur-sm py-3 sm:py-4 px-3 sm:px-4">
//       <div className="container flex justify-between items-center mx-auto">
//         <div className="flex items-center space-x-2">
//           <Trello className="text-blue-500"/>
//           <span className="text-xl sm:text-2xl text-gray-800 font-semibold">Task flow</span>
//         </div>
//         <div className="flex items-center space-x-2">
//             <SignedOut>

//             <SignInButton forceRedirectUrl="/dashboard">
//                 <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
//                     Sign In
//                 </Button>
//             </SignInButton>
//             <SignUpButton>
//                 <Button size="sm" className="text-xs sm:text-sm">
//                     Sign Up
//                 </Button>
//             </SignUpButton>
//             </SignedOut>
//             <SignedIn>
//                 <UserButton/>
//             </SignedIn>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
