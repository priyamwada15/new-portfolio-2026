# Turns a Figma REST node JSON (from the user's Figma Tool) into a readable layer dump.
# Usage: PYTHONIOENCODING=utf-8 python figma-json-dump.py <node.json> <content-column-x> > dump.txt
import json, sys
d=json.load(open(sys.argv[1],encoding="utf-8"))
X0=float(sys.argv[2]) if len(sys.argv)>2 else 0
def hexc(c,op=1):
    a=c.get("a",1)*op
    h="#%02X%02X%02X"%tuple(round(c[k]*255) for k in "rgb")
    return h if a>=0.999 else f"{h}@{a:.2f}"
def paints(ps):
    out=[]
    for p in ps or []:
        if p.get("visible",True) is False: continue
        t=p["type"]
        if t=="SOLID": out.append(hexc(p["color"],p.get("opacity",1)))
        elif t=="IMAGE": out.append(f'IMG({p.get("imageRef","")[:10]},{p.get("scaleMode")})')
        else: out.append(t)
    return out
def walk(n,depth=0,hidden=False):
    vis = n.get("visible",True) is not False
    h = hidden or not vis
    bb=n.get("absoluteBoundingBox") or {}
    parts=[f'{n["type"]} "{n.get("name")}" {n["id"]}', f'@{round(bb.get("x",0)-X0)},{round(bb.get("y",0))} {round(bb.get("width",0))}x{round(bb.get("height",0))}']
    if h: parts.append("[HIDDEN]")
    lm=n.get("layoutMode")
    if lm and lm!="NONE":
        pad=[n.get(k,0) for k in ("paddingTop","paddingRight","paddingBottom","paddingLeft")]
        parts.append(f'{lm} gap{n.get("itemSpacing",0)} pad{pad} main:{n.get("primaryAxisAlignItems","MIN")} cross:{n.get("counterAxisAlignItems","MIN")}' + (" WRAP" if n.get("layoutWrap")=="WRAP" else ""))
    if n.get("layoutGrow"): parts.append("grow")
    if n.get("layoutPositioning")=="ABSOLUTE": parts.append("ABS")
    f=paints(n.get("fills"))
    if f and n["type"]!="TEXT": parts.append("fill="+",".join(f))
    s=paints(n.get("strokes"))
    if s: parts.append(f'stroke={",".join(s)} w{n.get("strokeWeight")}')
    if n.get("cornerRadius"): parts.append(f'r{n["cornerRadius"]}')
    if n.get("rectangleCornerRadii"): parts.append(f'radii{n["rectangleCornerRadii"]}')
    if n.get("clipsContent"): parts.append("clip")
    if n.get("opacity",1)<1: parts.append(f'op{n["opacity"]:.2f}')
    for e in n.get("effects") or []:
        if e.get("visible",True): parts.append(f'{e["type"]}({e.get("offset",{}).get("x",0)},{e.get("offset",{}).get("y",0)},{e.get("radius")},{e.get("spread",0)},{hexc(e["color"]) if "color" in e else ""})')
    if n.get("rotation"): parts.append(f'rot{n["rotation"]:.3f}')
    if n["type"]=="TEXT":
        st=n.get("style",{})
        lh=st.get("lineHeightPercentFontSize"); lhpx=st.get("lineHeightPx")
        parts.append(f'{st.get("fontFamily")} {st.get("fontWeight")}{" italic" if st.get("italic") else ""} {st.get("fontSize")}px lh{round(lhpx,1) if lhpx else ""} ls{round(st.get("letterSpacing",0),2)} {st.get("textAlignHorizontal","")} color={",".join(f)}')
        print("  "*depth+"  ".join(parts)); print("  "*depth+"   > "+n.get("characters","").replace("\n"," / "))
        ov=n.get("styleOverrideTable")
        if ov:
            for k,v in ov.items(): print("  "*depth+f"   override {k}: "+json.dumps({a:(paints(b) if a=="fills" else b) for a,b in v.items() if a in("fontWeight","fontSize","fills","italic","fontFamily","textDecoration")}))
        return
    print("  "*depth+"  ".join(parts))
    for c in n.get("children",[]): walk(c,depth+1,h)
walk(d)
