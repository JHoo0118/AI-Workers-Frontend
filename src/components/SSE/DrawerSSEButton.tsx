"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils/dateUtils";
import {
  getRoutePathByTaskType,
  getTaskTypeLabel,
} from "@/lib/utils/sseTaskUtils";
import useDrawerStore from "@/store/useDrawerStore";
import { useTaskListStore } from "@/store/useTaskListStore";
import { CheckCircle, Loader, WorkflowIcon, XCircle } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

export default function DrawerSSEButton() {
  const locale = useLocale();
  const { open, setOpen } = useDrawerStore();
  const taskList = useTaskListStore((state) => state.taskList);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="mr-4 rounded-full">
          <WorkflowIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle Workflow</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="ml-auto max-h-[80%] w-full max-w-4xl">
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle>진행 중인 작업</DrawerTitle>
            <DrawerDescription>
              현재 진행 중인 작업의 목록을 볼 수 있습니다.
              <span className="pl-1 font-semibold">
                작업에 시간이 많이 소요되는 일부 작업만 표시됩니다. (현재는{" "}
                <span className="text-primary ">AI Backend Code 생성</span>만
                지원)
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[80%] min-h-[60%] overflow-y-auto pb-0  pt-4">
            <div className="flex items-center justify-center space-x-2">
              <Table>
                <TableCaption>작업은 저장되지 않습니다.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>작업 종류</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>시작 시각</TableHead>
                    <TableHead>완료 시각</TableHead>
                    <TableHead>이동</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskList.map((task) => (
                    // <SSETask key={task.taskId} taskId={task.taskId} />
                    <TableRow key={task.taskId}>
                      <TableCell className="font-medium">
                        {getTaskTypeLabel(task.taskType)}
                      </TableCell>
                      {task.error ? (
                        <TableCell>
                          <XCircle className="text-red-500" />
                        </TableCell>
                      ) : task.completed ? (
                        <TableCell>
                          <CheckCircle className="text-green-500" />
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Loader className="animate-spin-slow text-blue-500" />
                        </TableCell>
                      )}
                      <TableCell>{formatDateTime(task.createdAt!)}</TableCell>
                      <TableCell>
                        {task.completedAt
                          ? formatDateTime(task.completedAt)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          asChild
                          type="button"
                          onClick={() =>
                            setTimeout(() => {
                              setOpen(false);
                            })
                          }
                          disabled={!task.completed || !!task.error}
                        >
                          <Link
                            href={getRoutePathByTaskType(locale, task.taskType)}
                          >
                            이동 →
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-center">
                      {taskList?.length ?? 0}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">확인</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
