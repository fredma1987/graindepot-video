package com.zhoubi.graindepot.rest;

import com.zhoubi.graindepot.bean.Video;
import com.zhoubi.graindepot.biz.VideoBiz;
import com.zhoubi.graindepot.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Administrator on 2019/2/16/016.
 */
@Controller
@RequestMapping("rpc")
public class RestVideoController extends BaseController{
    @Autowired
    private VideoBiz videoBiz;
    @RequestMapping(value = "/video/selectRegiterVideo", method = RequestMethod.GET)
    @ResponseBody
    public Video selectRegiterVideo(int graindepotid){
        return videoBiz.selectRegiterVideo(graindepotid);
    }
    @RequestMapping(value = "/video/selectWeightVideoList", method = RequestMethod.GET)
    @ResponseBody
    public List<Video> selectWeightVideoList(int graindepotid){
        return videoBiz.selectWeightVideoList(graindepotid);
    }

}
