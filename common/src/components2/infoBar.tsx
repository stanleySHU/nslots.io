import './infoBar.scss';

export function InfoBar() {
    return (
        <div className="info-bar-mod">
            <div className='list'>
            <div className="item w-20">
                <img className="icon-mod icon username" src="" />
                <div className="detail">
                    <div className="value">stanley</div>
                    <div className="description">username</div>
                </div>
            </div>
            <div className="item w-20">
                <img className="icon-mod icon bet" src="" />
                <div className="detail">
                    <div className="value">8888</div>
                    <div className="description">totel bet</div>
                </div>
            </div>
            <div className="item w-20">
                <img className="icon-mod icon win" src="" />
                <div className="detail">
                    <div className="value">8888</div>
                    <div className="description">win</div>
                </div>
            </div>
            <div className="item w-20">
                <img className="icon-mod icon balance" src="" />
                <div className="detail">
                    <div className="value">8888</div>
                    <div className="description">balance</div>
                </div>
            </div>
            <div className="item w-20">
                <img className="icon-mod icon time" src="" />
                <div className="detail">
                    <div className="value">17:48:00(GTM+8)</div>
                    <div className="description">time</div>
                </div>
            </div>
            </div>
        </div>
    )
}