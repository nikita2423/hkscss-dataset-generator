import { useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";

import { API_URL, selectedModel } from "@/lib/utils";

export function useGenerateDataset() {
  const model = selectedModel;

  const generateSingleDataset = useCallback(
    async ({ projectId, questionId, questionInfo }) => {
      // 获取模型参数
      if (!model) {
        toast.error("Select Model first");
        return null;
      }
      // 调用API生成数据集
      const currentLanguage = "en";
      toast.promise(
        axios.post(`${API_URL}/api/projects/${projectId}/datasets`, {
          questionId,
          model,
          language: currentLanguage,
        }),
        {
          loading: "Generating dataset...",
          description: `Question: 【${questionInfo}】`,
          position: "top-right",
          success: (data) => {
            return "Dataset generated successfully";
          },
          error: (error) => {
            return "datasets.generateFailed";
          },
        }
      );
    },
    [model]
  );

  // const generateMultipleDataset = useCallback(
  //   async (projectId, questions) => {
  //     let completed = 0;
  //     const total = questions.length;
  //     // 显示带进度的Loading
  //     const loadingToastId = toast.loading(
  //       `正在处理请求 (${completed}/${total})...`,
  //       { position: "top-right" }
  //     );

  //     // 处理每个请求
  //     const processRequest = async (question) => {
  //       try {
  //         const response = await axios.post(
  //           `/api/projects/${projectId}/datasets`,
  //           {
  //             questionId: question.id,
  //             model,
  //             language: i18n.language === "zh-CN" ? "中文" : "en",
  //           }
  //         );
  //         const data = response.data;
  //         completed++;
  //         toast.success(`${question.question} 完成`, { position: "top-right" });
  //         toast.loading(`正在处理请求 (${completed}/${total})...`, {
  //           id: loadingToastId,
  //         });
  //         return data;
  //       } catch (error) {
  //         completed++;
  //         toast.error(`${question.question} 失败`, {
  //           description: error.message,
  //           position: "top-right",
  //         });
  //         toast.loading(`正在处理请求 (${completed}/${total})...`, {
  //           id: loadingToastId,
  //         });
  //         throw error;
  //       }
  //     };

  //     try {
  //       const results = await Promise.allSettled(
  //         questions.map((req) => processRequest(req))
  //       );
  //       // 全部完成后更新Loading为完成状态
  //       toast.success(
  //         `全部请求处理完成 (成功: ${
  //           results.filter((r) => r.status === "fulfilled").length
  //         }/${total})`,
  //         {
  //           id: loadingToastId,
  //           position: "top-right",
  //         }
  //       );
  //       return results;
  //     } catch {
  //       // Promise.allSettled不会进入catch，这里只是保险
  //     }
  //   },
  //   [model, t]
  // );

  return { generateSingleDataset };
}
