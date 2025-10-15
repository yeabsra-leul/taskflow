"use client";

import { useBoard } from "@/lib/hooks/useBoards";
import React, { useEffect } from "react";
import { toast } from "sonner";

const BoardDetail = ({ boardId }: { boardId: string }) => {
  const { board, error, loadingBoard } = useBoard({ boardId });
  //   useEffect(() => {
  //     if (!boardId) {
  //       return;
  //     }

  //     const fetchBoard = async () => {
  //       try {
  //         await getBoard({ boardId });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     fetchBoard();

  //     console.log("boarddddd", board);
  //   }, [boardId]);
  //show toast error
//   useEffect(() => {
//     if (!error) return;

//     if (!loadingBoard) {
//       toast.error(error || "Failed to load board, please try again later!");
//     }
//   }, [error]);

  return (
    <div>
      BoardDetail {board?.title} {error}
    </div>
  );
};

export default BoardDetail;
