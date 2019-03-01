package com.zhoubi.graindepot.controller;

import com.zhoubi.graindepot.bean.Video;
import com.zhoubi.graindepot.biz.VideoBiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Administrator on 2019/2/16/016.
 */
@Controller
@RequestMapping("page")
public class PageController extends BaseController {
    @Autowired
    private VideoBiz videoBiz;
    @GetMapping("/video")
    public String toList(Model model){
        String title="监控列表";
        model.addAttribute("title",title);
        String path="/video/list";
        return path;
    }
    @GetMapping("/video/edit")
    public String toEdit(Model model,Integer id){
        String title="编辑监控";
        Video item=new Video();
        if(id!=null) {
            item = videoBiz.selectById(id);
        }
        model.addAttribute("title",title);
        model.addAttribute("item",item);
        model.addAttribute("id",id);
        String path="/video/edit";
        return path;
    }
    @GetMapping("/video/play/{id}")
    public String toPlay(Model model,@PathVariable int id){
        String title="监控播放";
        Video item=videoBiz.selectById(id);
        model.addAttribute("title",title);
        model.addAttribute("item",item);
        if(id!=0){
            model.addAttribute("videoid",id);
        }
        String path="/video/play_hik";
        if(item.getFacid()==1){
            path="/video/play_hik";
        }else if(item.getFacid()==2){
            path="/video/play_dh";
        }else{
            path="/video/play_ot";
        }
        return path;
    }
    @GetMapping("/video/detail/{id}")
    public String toDetail(Model model,@PathVariable int id){
        String title="监控详情";
        Video item=videoBiz.selectById(id);
        model.addAttribute("title",title);
        model.addAttribute("item",item);
        String path="/video/detail";
        return path;
    }

    @GetMapping("/video/demo")
    public String demo(Model model){
        String title="监控测试";
        model.addAttribute("title",title);
        return "demo";
    }
}
