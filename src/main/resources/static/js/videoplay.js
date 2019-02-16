/**
 * 海康威视ocx 2.3 版本
 * @type {number}
 */
//全局变量定义
var m_iNowChanNo = -1;                           //当前通道号
var m_iLoginUserId = -1;                         //注册设备用户ID
var m_iChannelNum = -1;							 //模拟通道总数
var m_bDVRControl = null;						 //OCX控件对象
var m_iProtocolType = 0;                         //协议类型，0 – TCP， 1 - UDP
var m_iStreamType = 0;                           //码流类型，0 表示主码流， 1 表示子码流
var m_iPlay = 0;                                 //当前是否正在预览
var m_iRecord = 0;                               //当前是否正在录像
var m_iTalk = 0;                                 //当前是否正在对讲 
var m_iVoice = 0;                                //当前是否打开声音
var m_iAutoPTZ = 0;                              //当前云台是否正在自转
var m_iPTZSpeed = 4;                             //云台速度
var reg=/^((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))$/;

//document.oncontextmenu = rightclick;
/*************************************************
 Function:    	rightclick
 Description:	网页禁用右键
 Input:        无
 Output:      	无
 Return:		bool:   true false
 *************************************************/
function rightclick()
{
	return false;
}
/*************************************************
 Function:    	rightclick
 Description:	网页禁用右键
 Input:        无
 Output:      	无
 Return:		bool:   true false
 *************************************************/
function ButtonPress(sKey)
{
	try
	{
		switch (sKey)
		{
			case "LoginDev":
			{
				var szDevIp = document.getElementById("DeviceIP").value;
				var szDevPort = document.getElementById("DevicePort").value;
				var szDevUser = document.getElementById("DeviceUsername").value;
				var szDevPwd = document.getElementById("DevicePasswd").value;
				//判断是ip,若不是IP则将域名转为IP
				if (!reg.test(szDevIp)) {
					szDevIp =  m_bDVRControl.GetServerIP(szDevIp);
				}
				m_iLoginUserId = m_bDVRControl.Login(szDevIp,szDevPort,szDevUser,szDevPwd);
				if(m_iLoginUserId == -1)
				{
					LogMessage("注册失败！");
				}
				else
				{
					LogMessage("注册成功！");
				}
				break;
			}
			case "LogoutDev":
			{
				if(m_bDVRControl.Logout())
				{
					LogMessage("注销成功！");
				}
				else
				{
					LogMessage("注销失败！");
				}
				break;
			}
			case "getDevName":
			{
				var szDecName = m_bDVRControl.GetServerName();
				//szDecName = szDecName.replace(/\s/g,"&nbsp;"); 
				if(szDecName == "")
				{
					LogMessage("获取名称失败！");
					szDecName = "Embedded Net DVR";
				}
				else
				{
					LogMessage("获取名称成功！");
				}
				document.getElementById("DeviceName").value = szDecName;
				break;
			}
			case "getDevChan":
			{
				szServerInfo = m_bDVRControl.GetServerInfo();
				//alert(szServerInfo);
				var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(szServerInfo);

				m_iChannelNum = parseInt(xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue);
				//alert(m_iChannelNum);
				//m_szDeviceType = xmlDoc.documentElement.childNodes[1].childNodes[0].nodeValue;
				//m_iChannelNum = parseInt(iChannelNum);
				if(m_iChannelNum < 1)
				{
					LogMessage("获取通道失败！");
				}
				else
				{
					LogMessage("获取通道成功！");
					document.getElementById("ChannelList").length = 0; //先清空下拉列表
					for(var i = 0; i < m_iChannelNum; i ++)
					{
						var szChannelName = m_bDVRControl.GetChannelName(i);
						if(szChannelName == "")
						{
							szChannelName = "通道" + (i + 1);
						}
						document.getElementById("ChannelList").options.add(new Option(szChannelName,i));
					}
				}
				break;
			}
			case "Preview:start":
			{
				m_iNowChanNo = parseInt(document.getElementById("ChannelList").value);
				if(m_iNowChanNo > -1)
				{
					if(m_iPlay == 1)
					{
						m_bDVRControl.StopRealPlay();
					}

					var bRet = m_bDVRControl.StartRealPlay(m_iNowChanNo,m_iProtocolType,m_iStreamType);
					if(bRet)
					{
						LogMessage("预览通道"+(m_iNowChanNo + 1) +"成功！");
						m_iPlay = 1;
					}
					else
					{
						LogMessage("预览通道"+(m_iNowChanNo + 1) +"失败！");
					}
				}
				else
				{
					LogMessage("请选择通道号！");
				}
				break;
			}
			case "Preview:stop":
			{

				if(m_bDVRControl.StopRealPlay())
				{
					LogMessage("停止预览成功！");
					m_iPlay = 0;
				}
				else
				{
					LogMessage("停止预览失败！");
				}
				break;
			}
			case "Preview:his":
			{
				if(m_iPlay == 1){
					ButtonPress('LogoutDev');
					ButtonPress('LoginDev');
					ButtonPress('getDevName');
				}
				var begin=document.getElementById("begin").value;
				var end=document.getElementById("end").value;
				m_iNowChanNo = parseInt(document.getElementById("ChannelList").value);
				if(m_bDVRControl.PlayBackByTime(m_iNowChanNo,begin,end))
				{
					LogMessage("播放录像成功！");
					m_iPlay = 0;
				}
				else
				{
					LogMessage("播放录像失败！");
				}
				break;
			}
			case "CatPic:bmp":
			{
				if(m_iPlay == 1)
				{
					if(m_bDVRControl.BMPCapturePicture("C:/OCXBMPCaptureFiles",1))
					{
						LogMessage("抓BMP图成功！");
					}
					else
					{
						LogMessage("抓BMP图失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "CatPic:jpeg":
			{
				if(m_iPlay == 1)
				{
					if(m_bDVRControl.JPEGCapturePicture((m_iNowChanNo + 1),2,0,"C:/OCXJPEGCaptureFiles",1))
					{
						LogMessage("抓JPEG图成功！");
					}
					else
					{
						LogMessage("抓JPEG图失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "Record:start":
			{
				alert("开始报备，结束报备请点击'停止报备'。");
				if(m_iPlay == 1)
				{
					if(m_iRecord == 0)
					{
						if(m_bDVRControl.StartRecord("C:/OCXRecordFiles"))
						{
							LogMessage("开始录像成功！");
							m_iRecord = 1;
						}
						else
						{
							LogMessage("开始录像失败！");
						}
					}
				}
				else
				{
					ButtonPress('LogoutDev');
					/**播放视频**/
					ButtonPress('LoginDev');
					ButtonPress('getDevName');
					ButtonPress('Preview:start');
					if(m_iPlay == 1)
					{
						if(m_iRecord == 0)
						{
							if(m_bDVRControl.StartRecord("C:/OCXRecordFiles"))
							{
								LogMessage("开始录像成功！");
								m_iRecord = 1;
							}
							else
							{
								LogMessage("开始录像失败！");
							}
						}
					}
					LogMessage("请先预览！");
				}
				break;
			}
			case "Record:stop":
			{
				if(m_iRecord == 1)
				{
					if(m_bDVRControl.StopRecord(1))
					{
						LogMessage("停止录像成功！");
						m_iRecord = 0;
					}
					else
					{
						LogMessage("停止录像失败！");
					}
				}
				break;
			}
			case "talk:start":
			{
				if(m_iLoginUserId > -1)
				{
					if(m_iTalk == 0)
					{
						if(m_bDVRControl.StartTalk(1))
						{
							LogMessage("开始对讲成功！");
							m_iTalk = 1;
						}
						else
						{
							LogMessage("开始对讲失败！");
						}
					}
				}
				else
				{
					LogMessage("请注册设备！");
				}
				break;
			}
			case "talk:stop":
			{
				if(m_iTalk == 1)
				{
					if(m_bDVRControl.StopTalk())
					{
						LogMessage("停止对讲成功！");
						m_iTalk = 0;
					}
					else
					{
						LogMessage("停止对讲失败！");
					}
				}
				break;
			}
			case "voice:start":
			{
				if(m_iPlay == 1)
				{
					if(m_iVoice == 0)
					{
						if(m_bDVRControl.OpenSound(1))
						{
							LogMessage("打开声音成功！");
							m_iVoice = 1;
						}
						else
						{
							LogMessage("打开声音失败！");
						}
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "voice:stop":
			{
				if(m_iVoice == 1)
				{
					if(m_bDVRControl.CloseSound(1))
					{
						LogMessage("关闭声音成功！");
						m_iVoice = 0;
					}
					else
					{
						LogMessage("关闭声音失败！");
					}
				}
				break;
			}
			case "PTZ:stop":
			{
				if(m_iPlay == 1)
				{
					if(m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed))
					{
						LogMessage("停止PTZ成功！");
						m_iAutoPTZ = 0;
					}
					else
					{
						LogMessage("停止PTZ失败！");
					}
				}
				break;
			}
			case "PTZ:leftup":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(13,m_iPTZSpeed))
					{
						LogMessage("PTZ左上成功！");
					}
					else
					{
						LogMessage("PTZ左上失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:rightup":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(14,m_iPTZSpeed))
					{
						LogMessage("PTZ右上成功！");
					}
					else
					{
						LogMessage("PTZ右上失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:up":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(0,m_iPTZSpeed))
					{
						LogMessage("PTZ上成功！");
					}
					else
					{
						LogMessage("PTZ上失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:left":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(2,m_iPTZSpeed))
					{
						LogMessage("PTZ向左成功！");
					}
					else
					{
						LogMessage("PTZ向左失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:right":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(3,m_iPTZSpeed))
					{
						LogMessage("PTZ向右成功！");
					}
					else
					{
						LogMessage("PTZ向右失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:rightdown":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(16,m_iPTZSpeed))
					{
						LogMessage("PTZ右下成功！");
					}
					else
					{
						LogMessage("PTZ右下失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:leftdown":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(15,m_iPTZSpeed))
					{
						LogMessage("PTZ左下成功！");
					}
					else
					{
						LogMessage("PTZ左下失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:down":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(1,m_iPTZSpeed))
					{
						LogMessage("PTZ向下成功！");
					}
					else
					{
						LogMessage("PTZ向下失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "PTZ:auto":
			{
				if(m_iPlay == 1)
				{
					if(m_bDVRControl.PTZCtrlStart(10,m_iPTZSpeed))
					{
						LogMessage("PTZ自转成功！");
						m_iAutoPTZ = 1;
					}
					else
					{
						LogMessage("PTZ自转失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "zoom:in":
			{

				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(4,m_iPTZSpeed))
					{
						LogMessage("焦距拉近成功！");
					}
					else
					{
						LogMessage("焦距拉近失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "zoom:out":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(5,m_iPTZSpeed))
					{
						LogMessage("焦距拉远成功！");
					}
					else
					{
						LogMessage("焦距拉远失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "focus:in":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(6,m_iPTZSpeed))
					{
						LogMessage("聚焦拉近成功！");
					}
					else
					{
						LogMessage("聚焦拉近失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "focus:out":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(7,m_iPTZSpeed))
					{
						LogMessage("聚焦拉远成功！");
					}
					else
					{
						LogMessage("聚焦拉远失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "iris:in":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(8,m_iPTZSpeed))
					{
						LogMessage("光圈大成功！");
					}
					else
					{
						LogMessage("光圈大失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "iris:out":
			{
				if(m_iPlay == 1)
				{
					if(m_iAutoPTZ == 1)
					{
						m_bDVRControl.PTZCtrlStop(10,m_iPTZSpeed);
						m_iAutoPTZ = 0;
					}
					if(m_bDVRControl.PTZCtrlStart(9,m_iPTZSpeed))
					{
						LogMessage("光圈小成功！");
					}
					else
					{
						LogMessage("光圈小失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "getImagePar":
			{
				if(m_iPlay == 1)
				{
					var szXmlInfo = m_bDVRControl.GetVideoEffect();
					if(szXmlInfo != "")
					{
						var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async="false";
						xmlDoc.loadXML(szXmlInfo);
						document.getElementById("PicLight").value = xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue;
						document.getElementById("PicContrast").value = xmlDoc.documentElement.childNodes[1].childNodes[0].nodeValue;
						document.getElementById("PicSaturation").value = xmlDoc.documentElement.childNodes[2].childNodes[0].nodeValue;
						document.getElementById("PicTonal").value = xmlDoc.documentElement.childNodes[3].childNodes[0].nodeValue;
						LogMessage("获取图像参数成功！");
					}
					else
					{
						LogMessage("获取图像参数失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "setImagePar":
			{
				if(m_iPlay == 1)
				{
					var iL = parseInt(document.getElementById("PicLight").value);
					var iC = parseInt(document.getElementById("PicContrast").value);
					var iS = parseInt(document.getElementById("PicSaturation").value);
					var iT = parseInt(document.getElementById("PicTonal").value);
					var bRet = m_bDVRControl.SetVideoEffect(iL,iC,iS,iT);
					if(bRet)
					{
						LogMessage("设置图像参数成功！");
					}
					else
					{
						LogMessage("设置图像参数失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "setPreset":
			{
				if(m_iPlay == 1)
				{
					var iPreset = parseInt(document.getElementById("Preset").value);
					var bRet = m_bDVRControl.PTZCtrlSetPreset(iPreset);
					if(bRet)
					{
						LogMessage("设置预置点成功！");
					}
					else
					{
						LogMessage("设置预置点失败！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			case "goPreset":
			{
				if(m_iPlay == 1)
				{
					var iPreset = parseInt(document.getElementById("Preset").value);
					var bRet = m_bDVRControl.PTZCtrlGotoPreset(iPreset);
					if(bRet)
					{
						LogMessage("调用预置点成功！");
					}
					else
					{
						LogMessage("调用预置点成功！");
					}
				}
				else
				{
					LogMessage("请先预览！");
				}
				break;
			}
			default:
			{
				//Record:start   setPreset
				break;
			}
		}		//switch  
	}
	catch(err)
	{
		//alert(err);
	}
}
/*************************************************
 Function:    	LogMessage
 Description:	写执行结果日志
 Input:        msg:日志
 Output:      	无
 Return:		无
 *************************************************/
function LogMessage(msg)
{
	var myDate = new Date();
	var szNowTime = myDate.toLocaleString( );                   //获取日期与时间
	//document.getElementById("OperatLogBody").innerHTML = szNowTime + " --> " + msg + "<br>" + document.getElementById("OperatLogBody").innerHTML;
}
function changeshipin(){
	var begin=document.getElementById("begin").value;
	var end=document.getElementById("end").value;
	if(begin==""){
		alert("请输入开始时间");
		return;
	}
	if(end==""){
		alert("请输入结束时间");
		return;
	}
	if(begin>=end){
		alert("开始时间要早于结束时间");
		return;
	}
	ButtonPress('LogoutDev');
	ButtonPress('LoginDev');
	ButtonPress('getDevName');
	ButtonPress('Preview:his');

}